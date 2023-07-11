/**
 *
 * @param {*} data - Chứa dữ liệu cần được format - {type: 'number' | 'text', value}
 * @returns - Gía trị đã được format
 * - Author: DDKhang (11/7/2023)
 */
export function FormatNumberPrice(data) {
  if (data.type == 'number') {
    //let inputValue = (value + "").replace(/\D/g, "");
    // inputValue = Number(inputValue).toLocaleString();
    // return inputValue;
    const strNumber = (data.value + '').replace(/\D/g, '')
    const length = strNumber.length

    // Tính toán số lượng dấu chấm cần chèn
    const dotCount = Math.floor((length - 1) / 3)

    // Xác định vị trí bắt đầu của dấu chấm
    const dotStartIndex = length - dotCount * 3

    // Chèn dấu chấm vào chuỗi số
    let formattedNumber = strNumber.slice(0, dotStartIndex)
    for (let i = dotStartIndex; i < length; i += 3) {
      formattedNumber += '.' + strNumber.slice(i, i + 3)
    }
    return formattedNumber
  }
  return data.value
}
