//
//
// import { StatusCodes } from "http-status-codes";
// import { ERROR_SYSTEM } from "./classification";
// import {
//   ApplicationError,
//   AuthenticationFailed,
//   AuthorizationFailed,
//   BusinessLogicFailed,
//   ValidationFailed
// } from "./errors";
//
// function getErrorCategory(subcode: string): string | undefined {
//   return ERROR_SYSTEM[subcode];
// }
//
// function mapCategoryToStatus(category?: string): number {
//   switch (category) {
//     case "validation":
//       return StatusCodes.BAD_REQUEST; // 400
//     case "authentication":
//       return StatusCodes.UNAUTHORIZED; // 401
//     case "authorization":
//       return StatusCodes.FORBIDDEN; // 403
//     case "business-logic":
//       return StatusCodes.UNPROCESSABLE_ENTITY; // 422
//     case "external-service":
//       return StatusCodes.BAD_GATEWAY; // 502
//     case "system":
//     default:
//       return StatusCodes.INTERNAL_SERVER_ERROR; // 500
//   }
// }
//
// /**
//  * Wraps an async controller logic block, enhancing error handling to standardize response types.
//  */
// export async function withAppErrorHandlingBlock<T>(fn: () => Promise<T>): Promise<T> {
//   try {
//     return await fn();
//   } catch (err: any) {
//     const subcode = err?.subcode;
//     const category = getErrorCategory(subcode);
//     const status = mapCategoryToStatus(category);
//
//     // Known structured error — rewrap with appropriate status if needed
//     if (err instanceof ValidationFailed ||
//       err instanceof BusinessLogicFailed ||
//       err instanceof AuthenticationFailed ||
//       err instanceof AuthorizationFailed
//     ) {
//       throw new ApplicationError(status, err.message, err);
//     }
//
//     // JS errors
//     if (err instanceof TypeError || err instanceof SyntaxError) {
//       throw new ApplicationError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid input format", err);
//     }
//
//     // Fallback
//     throw new ApplicationError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       "Unexpected system error",
//       err
//     );
//   }
// }
//
//
// //example usage
// @httpPatch("/reset-password", autoValidate(isResetPasswordDTO), verify2FA("reset-password"))
// async resetPassword(
//   @request() req: Request,
// @response() res: Response,
// @requestBody() dto: ResetPasswordDTO
// ) {
//   await withAppErrorHandlingBlock(async () => {
//     const { password, email_address } = dto;
//
//     const user = await this.repo.findByEmail(email_address);
//     if (!user) {
//       throw new BusinessLogicFailed(
//         BusinessLogicSubCodes.RESOURCE_NOT_FOUND,
//         `We could not find any account for ${email_address}`
//       );
//     }
//
//     const hashed = await hash(password, 10);
//     const updatedUser = await this.repo.updatePassword(user.id, hashed);
//
//     const session = await this.sessions.create(req, updatedUser);
//     this.send(req, res, session);
//   });
// }
//


//auth.ts
//
// import env from "@app/config/env";
// import { ApplicationError } from "@app/internal/errors";
// import { RedisStore, jwt as octojwt } from "@risemaxi/octonet";
// import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { Session } from "@app/sessions";
// import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
// import { Actions } from "@app/core/verifications";
// import { loadSession } from "./manator";
// import { AuthenticationFailed, AuthenticationSubCodes } from "@app/internal/rise-beacon";
//
// let tokenStore: RedisStore;
//
// export function initStore(store: RedisStore) {
//   tokenStore = store;
// }
//
// /**
//  * Load the claims from headless request into `Request.session`
//  * @param req express request
//  * @param res express respone
//  * @param next next middleware function
//  */
// export async function headlessOnly(req: Request, _res: Response, next: NextFunction) {
//   const authSession = req.headers.authorization;
//
//   if (!authSession) {
//     return handleAuthError(next,"We could not authenticate your request");
//   }
//
//   const [scheme, token] = authSession.split(/\s+/);
//
//   if (scheme !== env.auth_scheme) {
//     return handleAuthError(next, `${scheme} is not supported`);
//   }
//
//   try {
//     req.session = await octojwt.decode(env.service_secret_bytes, token);
//     return next();
//   } catch (err) {
//     if (err instanceof TokenExpiredError) {
//       return handleAuthError(next, "Your authentication has expired", AuthenticationSubCodes.TOKEN_EXPIRED);
//     }
//     if (err instanceof JsonWebTokenError) {
//       return handleAuthError(next, "We could not verify your authentication");
//     }
//     return next(err);
//   }
// }
//
// /**
//  * Load the session of the user into `Request.session`
//  * @param req express request
//  * @param res express response
//  * @param next next middleware function
//  */
// export async function authenticate(req: Request, res: Response, next: NextFunction) {
//   const authSession = req.headers.authorization;
//
//   if (!authSession) {
//     return handleAuthError(next, "We could not authenticate your request");
//   }
//
//   const [scheme, token] = authSession.split(/\s+/);
//
//   if (scheme === env.auth_scheme) {
//     try {
//       req.session = await octojwt.decode(env.service_secret_bytes, token);
//     } catch (err) {
//       return handleAuthError(next, "Invalid or expired token", AuthenticationSubCodes.TOKEN_EXPIRED);
//     }
//   } else if (scheme === "Bearer") {
//     const session = await tokenStore.extend<Session>(token, `${env.session_ttl}s`);
//
//     if (!session) {
//       // NB: If there's no session, we need to validate that it's a deprecated session from the legacy system,
//       return loadSession(req, res, next);
//     }
//
//     const device = req.headers.device as string | undefined;
//
//     if (!device || session.device !== device) {
//       return handleAuthError(next, "Your session is invalid");
//     }
//
//     req.session = session;
//   } else {
//     return handleAuthError(next, `${scheme} is not supported. Please use the Bearer scheme`);
//   }
//
//   next();
// }
//
// export async function generateToken(session: Session, timeout: string = "5m") {
//   return await octojwt.encode(env.service_secret_bytes, timeout, session);
// }
//
// export async function authenticateOptional(req: Request, res: Response, next: NextFunction) {
//   const authSession = req.headers.authorization;
//
//   if (!authSession) {
//     return next();
//   }
//
//   await authenticate(req, res, next);
// }
//
// export function verify2FA(expectedAction: string) {
//   return async (req: Request, _res: Response, next: NextFunction) => {
//     const token = req.headers["x-rise-authorization-token"] as string | undefined;
//
//     if (!token) {
//       return handleAuthError(next, "We could not validate your request");
//     }
//
//     try {
//       const actualAction = await tokenStore.peek<Actions>(token);
//
//       if (actualAction !== expectedAction) {
//         return handleAuthError(next, "You can't perform this action", AuthenticationSubCodes.BASE);
//       }
//
//       await tokenStore.revoke(token);
//       return next();
//     } catch (err) {
//       return handleAuthError(next, "There was an issue verifying your request");
//     }
//   };
// }
//
//
// //helper functions
// function handleAuthError(
//   next: NextFunction,
//   message: string,
//   subCode: AuthenticationSubCodes = AuthenticationSubCodes.BASE
// ) {
//   const authError = new AuthenticationFailed(subCode, message);
//   return next(new ApplicationError(StatusCodes.UNAUTHORIZED, authError.message, authError));
// }
