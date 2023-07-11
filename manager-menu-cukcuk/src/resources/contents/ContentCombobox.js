const ContentCombobox = {
  optionsFoodTypeRecord: [
    {
      id: 'ft-1',
      value: 'Tất cả',
      valueFilter: 1,
      typeCondition: '=',
      property: 'TypeFoodId',
      type: 'GUID',
      addition: 'and'
    },
    {
      id: 'ft-2',
      value: 'Món ăn',
      valueFilter: 2,
      typeCondition: '=',
      property: 'TypeFoodId',
      type: 'GUID',
      addition: 'and'
    }
  ],
  optionsStopSelling: [
    {
      id: 'ss-1',
      value: 'Tất cả',
      valueFilter: '(0, 1)', // Tìm kiếm theo điều kiện có
      typeCondition: 'IN',
      property: 'StopSelling',
      type: 'string',
      addition: 'and'
    },
    {
      id: 'ss-2',
      value: 'Có',
      valueFilter: '1', // Tìm kiếm theo điều kiện có
      typeCondition: '=',
      property: 'StopSelling',
      type: 'int',
      addition: 'and'
    },
    {
      id: 'ss-3',
      value: 'Không',
      valueFilter: '0', // Tìm kiếm theo điều kiện không
      typeCondition: '=',
      property: 'StopSelling',
      type: 'int',
      addition: 'and'
    }
  ],
  optionsShowOnMenu: [
    {
      id: 'ss-1',
      value: 'Tất cả',
      valueFilter: '(0, 1)', // Tìm kiếm theo điều kiện có
      typeCondition: 'IN',
      property: 'ShowOnMenu',
      type: 'string',
      addition: 'and'
    },
    {
      id: 'ss-2',
      value: 'Có',
      valueFilter: '1', // Tìm kiếm theo điều kiện có
      typeCondition: '=',
      property: 'ShowOnMenu',
      type: 'int',
      addition: 'and'
    },
    {
      id: 'ss-3',
      value: 'Không',
      valueFilter: '0', // Tìm kiếm theo điều kiện không
      typeCondition: '=',
      property: 'ShowOnMenu',
      type: 'int',
      addition: 'and'
    }
  ]
}

export default ContentCombobox
