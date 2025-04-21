import createAxios from '/@/utils/axios'

export function getUserRules() {
    return createAxios({
        url: '/admin/user.Rule/index',
        method: 'get',
    })
}
export function pstUserpsw(userId: string) {
    return createAxios({
        url:'/admin/user.User/resetPassword',
        method: 'post',
        data: {
            userId: userId,
        },
    })
}
export function postpaidan(data: anyObj) {
    return createAxios({
        url:'/admin/order.Order/putAwarded',
        method: 'post',
        data: data
    })
}
export function postchangmoney(data: anyObj) {
    return createAxios({
        url:'/admin/user.User/addUserBalance',
        method: 'post',
        data: data
    })
}
