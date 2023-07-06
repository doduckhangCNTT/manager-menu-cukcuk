import axios from 'axios'
import BaseUrl from './BaseUrl'
// import { CatchError } from '../functions/CatchError'
import HttpStatusCodeEnum from '../resources/enums/HttpStatusCodeEnum'
import { CatchError } from './functions/CatchError'

/**
 *
 * @pEnumaram {*} url - Đường dẫn api
 * @returns dữ liệu phản hồi từ server
 * - Des: Thực hiện lấy dữ liệu phản hồi từ server
 * - CreatedBy: DDKhang (27/5/2023)
 */
export async function getData(url) {
  try {
    const res = await axios.get(url)
    return res
  } catch (error) {
    CatchError(error)
  }
}

/**
 *
 * @param {*} url - Đường dẫn api
 * @param {*} post  - Dữ liệu muốn thêm
 * @returns Thông tin phản hồi từ server (số bản ghi được thêm)
 * - Des: Thực hiện thêm thông tin
 * - CreatedBy: DDKhang (27/5/2023)
 */
export async function postData(url, post) {
  try {
    const res = await axios.post(url, post)
    return res
  } catch (error) {
    CatchError(error)
  }
}

/**
 * @param {} entityName - tên thực thể
 * @returns AxiosResponse<any, any>
 * - Des: Thực hiện lấy mã code mới cho thực thể
 * - CreateBy: DDKhang (27/5/2023)
 */
export async function getNewCode(entityName, prefixData) {
  let res
  try {
    if (prefixData) {
      res = await getData(`${BaseUrl}/${entityName}/newCode?prefixEntity=${prefixData}`)
    } else {
      res = await getData(`${BaseUrl}/${entityName}/newCode`)
    }
    return res
  } catch (error) {
    CatchError(error)
  }
}

/**
 * @param {*} entityName - Tên thực thể
 * @param {*} objGet - (Object) đối tượng chứa mã đồ ăn { ids: "..." }
 * @returns AxiosResponse<any, any>
 * - Des: Thực hiện lấy thông tin thực thể theo mã thực thể (id)
 */
export async function getDataById(entityName, objGet) {
  try {
    const res = await postData(`${BaseUrl}/${entityName}/Ids`, objGet)
    return res
  } catch (error) {
    CatchError(error)
  }
}

/**
 * @param {*} entityId - Mã thực thể
 * @param {*} entityName - Tên thực thể
 * @param {*} entity  - Thông tin thực thể mới
 * - Des: Thực hiện cập nhật thông tin entity
 * - Created By: DDKhang (27/5/2023)
 */
export async function updateInfoEntity(entityName, entity) {
  try {
    const res = await axios.put(`${BaseUrl}/${entityName}`, entity)
    return {
      response: res,
      status: HttpStatusCodeEnum.Success
    }
  } catch (error) {
    CatchError(error)
    return {
      status: HttpStatusCodeEnum.ServerError
    }
  }
}

/**
 * @param {*} entityName - Tên thực thể
 * @param {*} entity  - Thông tin thực thể mới
 * - Des: Thực hiện thêm thông tin entity
 * - Created By: DDKhang (27/5/2023)
 */
export async function postInfoEntity(entityName, entity) {
  try {
    const res = await axios.post(`${BaseUrl}/${entityName}`, entity)
    return {
      response: res,
      status: HttpStatusCodeEnum.Success
    }
  } catch (error) {
    CatchError(error)
  }
}

/**
 *
 * @param {*} entityName - Tên thực thể
 * @param {Object} formatOptionFilter - Thông tin muốn lọc
 *    {Page: Number, Start: Number, Limit: Number, Filters: Array}
 * @returns
 */
export async function filterInfoEntity(entityName, formatOptionFilter) {
  try {
    const res = await postData(`${BaseUrl}/${entityName}/filter`, formatOptionFilter)
    return res
  } catch (error) {
    CatchError(error)
  }
}

/**
 *
 * @param {*} entityName - Tên thực thể
 * @param {*} listEntityId - Danh sách các id thực thể muốn xóa theo dạng "string" ngăn cách = ","
 * - Des: Thực hiện xóa các thông tin entity
 * - Created By: DDKhang (27/5/2023)
 */
export async function deleteMultiple(entityName, listEntityId) {
  try {
    const res = await axios.delete(
      `${BaseUrl}/${entityName}/delete-multiple?listEntityId=${listEntityId}`
    )
    return res
  } catch (error) {
    CatchError(error)
  }
}
