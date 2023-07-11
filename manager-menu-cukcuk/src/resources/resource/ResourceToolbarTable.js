import TypeToolbarBtnEnum from '../enums/TypeToolbarBtnEnum'

const ResourceToolbarTable = {
  toolbarItems: [
    {
      title: 'Thêm',
      classIcon: 'toolbarItem-add-icon',
      tooltip: 'CTRL + 1',
      type: TypeToolbarBtnEnum.create
    },
    {
      title: 'Nhân bản',
      classIcon: 'toolbarItem-duplicate-icon',
      tooltip: 'Nhân bản',
      type: TypeToolbarBtnEnum.duplicate
    },
    {
      title: 'Sửa',
      classIcon: 'toolbarItem-edit-icon',
      tooltip: 'CTRL + E',
      type: TypeToolbarBtnEnum.edit
    },
    {
      title: 'Xóa',
      classIcon: 'toolbarItem-delete-icon',
      tooltip: 'CTRL + D',
      type: TypeToolbarBtnEnum.delete
    },
    {
      title: 'Nạp',
      classIcon: 'toolbarItem-refresh-icon',
      tooltip: 'CTRL + Y',
      type: TypeToolbarBtnEnum.refresh
    }
  ],

  btnHandleForm: [
    {
      title: 'Cất',
      classIcon: '',
      tooltip: 'CTRL + S',
      type: TypeToolbarBtnEnum.saveAdd
    }
  ]
}

export default ResourceToolbarTable
