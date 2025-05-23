import { i18n } from '/@/lang/index'

/*
 * 默认Url点击事件处理
 */
export const openUrl = (url: string, field: TableColumn) => {
    if (field.target == '_blank') {
        window.open(url)
    } else {
        window.location.href = url
    }
}

/*
 * 默认按钮组
 */
export const defaultOptButtons = (optButType: DefaultOptButType[] = ['weigh-sort', 'edit', 'delete','abcde']): OptButton[] => {
    const optButtonsPre: Map<string, OptButton> = new Map([
        [
            'psd',
            {
                render: 'tipButtonn',
                name: 'edit',
                title: '修改密码',
                text: '',
                type: 'info',
                icon: 'el-icon-Tools',
                class: 'table-row-edit',
                disabledTip: false,
            },
        ],
        [
            'weigh-sort',
            {
                render: 'moveButton',
                name: 'weigh-sort',
                title: 'Drag sort',
                text: '',
                type: 'info',
                icon: 'fa fa-arrows',
                class: 'table-row-weigh-sort',
                disabledTip: false,
            },
        ],
        [
            'edit',
            {
                render: 'tipButton',
                name: 'edit',
                title: 'Edit',
                text: '',
                type: 'primary',
                icon: 'fa fa-pencil',
                class: 'table-row-edit',
                disabledTip: false,
            },
        ],
        [
            'delete',
            {
                render: 'confirmButton',
                name: 'delete',
                title: 'Delete',
                text: '',
                type: 'danger',
                icon: 'fa fa-trash',
                class: 'table-row-delete',
                popconfirm: {
                    confirmButtonText: i18n.global.t('Delete'),
                    cancelButtonText: i18n.global.t('Cancel'),
                    confirmButtonType: 'danger',
                    title: i18n.global.t('Are you sure to delete the selected record?'),
                },
                disabledTip: false,
            },
        ],
    ])

    const optButtons: OptButton[] = []
    for (const key in optButType) {
        if (optButtonsPre.has(optButType[key])) {
            optButtons.push(optButtonsPre.get(optButType[key])!)
        }
    }
    return optButtons
}

/**
 * 将带children的数组降维，然后寻找index所在的行
 */
export const findIndexRow = (data: TableRow[], findIdx: number, keyIndex: number | TableRow = -1): number | TableRow => {
    for (const key in data) {
        if (typeof keyIndex == 'number') {
            keyIndex++
        }

        if (keyIndex == findIdx) {
            return data[key]
        }

        if (data[key].children) {
            keyIndex = findIndexRow(data[key].children!, findIdx, keyIndex)
            if (typeof keyIndex != 'number') {
                return keyIndex
            }
        }
    }

    return keyIndex
}

type DefaultOptButType = 'weigh-sort' | 'edit' | 'delete'
