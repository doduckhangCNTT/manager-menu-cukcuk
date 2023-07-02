import TypeFilterEnum from '../enums/TypeFilterEnum'

const ContentPopup = {
  PopupNormal: [
    {
      id: 1,
      value: '* : Chứa',
      icon: '*',
      typeFilter: TypeFilterEnum.Include,
      typeCondition: 'LIKE',
      addition: 'and'
    },
    {
      id: 2,
      value: '= : Bằng',
      icon: '=',
      typeFilter: TypeFilterEnum.Equal,
      typeCondition: '=',
      addition: 'and'
    },
    {
      id: 3,
      value: '+ : Bắt đầu bẳng',
      icon: '+',
      typeFilter: TypeFilterEnum.StartEqual,
      typeCondition: 'STARTWITH',
      addition: 'and'
    },
    {
      id: 4,
      value: '-  : Kết thúc bằng',
      icon: '-',
      typeFilter: TypeFilterEnum.EndEqual,
      typeCondition: 'ENDWITH',
      addition: 'and'
    },
    {
      id: 5,
      value: '!  : Không chứa',
      icon: '!',
      typeFilter: TypeFilterEnum.NotContain,
      typeCondition: 'NOTLIKE',
      addition: 'and'
    }
  ],

  PopupPrice: [
    {
      id: 1,
      value: '= : Bằng',
      icon: '=',
      typeFilter: TypeFilterEnum.Include,
      typeCondition: '=',
      addition: 'and'
    },
    {
      id: 2,
      value: '< : Nhỏ hơn',
      icon: '<',
      typeFilter: TypeFilterEnum.Equal,
      typeCondition: '<',
      addition: 'and'
    },
    {
      id: 3,
      value: '<= : Nhỏ hơn hoặc bằng',
      icon: '<=',
      typeFilter: TypeFilterEnum.StartEqual,
      typeCondition: '<=',
      addition: 'and'
    },
    {
      id: 4,
      value: '>  : Lớn hơn',
      icon: '>',
      typeFilter: TypeFilterEnum.EndEqual,
      typeCondition: '>',
      addition: 'and'
    },
    {
      id: 5,
      value: '>=  : Lớn hơn hoặc bằng',
      icon: '>=',
      typeFilter: TypeFilterEnum.NotContain,
      typeCondition: '>=',
      addition: 'and'
    }
  ]
}

export default ContentPopup
