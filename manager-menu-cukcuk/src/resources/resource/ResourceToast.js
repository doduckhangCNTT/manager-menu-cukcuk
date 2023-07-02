import HttpStatusCodeEnum from '../enums/HttpStatusCodeEnum'

const ResourceToast = {
  AddEntity: {
    AddSuccess: {
      status: HttpStatusCodeEnum.Success,
      msg: 'Đã thêm!'
    }
  },
  UpdateEntity: {
    UpdateSuccess: {
      status: HttpStatusCodeEnum.Success,
      msg: 'Đã cập nhật!'
    }
  },
  DeleteEntity: {
    DeleteSuccess: {
      status: HttpStatusCodeEnum.Success,
      msg: 'Đã xóa!'
    },
    DeleteError: {
      status: HttpStatusCodeEnum.ServerError,
      msg: 'Có lỗi xảy ra vui lòng liên hệ MISA để được trợ giúp!'
    }
  },
  Server: {
    Error: {
      status: HttpStatusCodeEnum.ServerError,
      msg: 'Có lỗi xảy ra vui lòng liên hệ MISA để được trợ giúp!'
    }
  }
}

export default ResourceToast
