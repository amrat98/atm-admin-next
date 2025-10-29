export const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const apiConfig = {
    login: baseUrl + "admin/login",
    otpVerify: baseUrl + "admin/loginOTPVerify",
    otpResend: baseUrl + "admin/forgotPasswordSendOTP",
    getUsers: baseUrl + "admin/listUser",
    blockUsers: baseUrl + "admin/blockUnblockUser",
    blockWallets: baseUrl + "admin/block-unblock-withdraw",
    listPoolUser: baseUrl + "admin/listPoolUser",
    transactionList: baseUrl + "admin/assetsTransactionList",
    availableBurn: baseUrl + "admin/available-to-burn",
    burnedBurn: baseUrl + "admin/available-to-burn?status=burned",
    burnCoins: baseUrl +  "admin/burn-coins",
    burnStats: baseUrl + "admin/burning-stats",
    getSubscription: baseUrl + "admin/viewUserSubscriptionDetails",
    buyPlanUsers: baseUrl + "buy/get-plan-for-users",
    getPlans: baseUrl + "buy/getTradingBotDetails",
    getAirdropUsers: baseUrl + "airdrop/admin-get-airdrop-users",
    updatedAirdropReward: baseUrl + "airdrop/admin-update-reward",
    getWithdrawList: baseUrl + "admin/asste-transaction-withdraw-list",
    actionWithdraw: baseUrl + "admin/approveWithdrawReq",
    blogs: {
        add: baseUrl + "admin/add-blog",
        get: baseUrl + "admin/get-blogs",
        update: baseUrl + "admin/edit-blog",
        delete: baseUrl + "admin/delete-blog",
    },
    teams: {
        add: baseUrl + "admin/add-team",
        get: baseUrl + "admin/get-team",
        update: baseUrl + "admin/edit-team",
        delete: baseUrl + "admin/delete-team",
    }
}