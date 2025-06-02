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
