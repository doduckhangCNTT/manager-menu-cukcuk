const InputFunctions = {
  restrictNonNumeric(event) {
    // Loại bỏ các ký tự không phải số
    const keyCode = event.keyCode
    if (
      !(
        (
          keyCode === 8 || // Backspace
          keyCode === 9 || // Tab
          keyCode === 37 || // Left arrow
          keyCode === 39 || // Right arrow
          (keyCode >= 48 && keyCode <= 57) || // 0-9
          (keyCode >= 96 && keyCode <= 105)
        ) // Numpad 0-9
      )
    ) {
      event.preventDefault()
    }
  }
}

export default InputFunctions
