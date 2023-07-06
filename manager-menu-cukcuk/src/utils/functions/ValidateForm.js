/**
 *
 * @param {*} data - Dữ liệu muốn kiểm tra
 * @returns {status: trạng thái(boolean), msg: thông báo}
 * - Author: DDKhang (24/5/2023)
 */
export function checkBlank(data) {
  if (data.value?.trim() === '' || !data.value) {
    return {
      status: true,
      msg: data.title + ' bắt buộc nhập.'
    }
  }
  return {
    status: false,
    msg: ''
  }
}
