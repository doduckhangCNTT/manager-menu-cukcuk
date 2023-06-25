const MagicNumberEnum = {
  MISACombobox: {
    totalPaddingOnLowerOfListItem: 16, // Tổng số padding trên dưới của listItem
    heightDefaultCombobox: 30,
    amountMaxShowOnListItem: 5
  },
  EmployeeList: {
    popup: {
      // Số lượng hiển thị trên màn hình danh sách, vd có 20 bản ghi trên 1 trang thì ban đầu vào trang chưa kéo scroll thì chỉ có thể nhìn thấy 14 bản ghi tối đa
      // Mục đích là để hiển thị popup khi số bản ghi vượt qua 14 -> hiển thị popup lên đầu
      qualityViewInitial: 14,
      // Số lượng bản ghi được ảnh hưởng (popup top) từ dưới lên trong số lượng bản ghi
      qualityRecordShowPopupTop: 2
    }
  }
}

export default MagicNumberEnum
