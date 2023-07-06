import HttpStatusCodeEnum from '../../resources/enums/HttpStatusCodeEnum'
import EmitterEnum from '../../resources/enums/EmitterEnum'
import emitter from 'tiny-emitter/instance'

/**
 * - Params:
 *    + err: thông tin lỗi
 * - Des: Thực hiện hiển thị dialog lỗi
 * - Author: DDKhang
 * - CreateAt: 24/4/2023
 * - ModifierAt: 24/4/2023
 */
export function CatchError(error) {
  console.log('Error: ', error)

  // const eventEmitter = new emitter();
  const statusCode = error.response?.status
  const errorsValidate = error.response.data?.UserMessages
  // let errors = []
  switch (statusCode) {
    case HttpStatusCodeEnum.BadRequest:
      emitter.emit(EmitterEnum.showDialogNotification, errorsValidate)
      // Thực hiện phát mã lỗi đến dialog
      break
    case HttpStatusCodeEnum.ServerError:
      break
    default:
      break
  }
}
