export const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const apiConfig = {
    login: baseUrl + "admin/login",
    otpVerify: baseUrl + "admin/loginOTPVerify",
    otpResend: baseUrl + "admin/forgotPasswordSendOTP",
    getUsers: baseUrl + "admin/listUser",
    blockUsers: baseUrl + "admin/blockUnblockUser",
    listPoolUser: baseUrl + "admin/listPoolUser",
    transactionList: baseUrl + "admin/assetsTransactionList",
    availableBurn: baseUrl + "admin/available-to-burn",
    burnedBurn: baseUrl + "admin/available-to-burn?status=burned",
    burnCoins: baseUrl +  "admin/burn-coins",
    burnStats: baseUrl + "admin/burning-stats",
    getSubscription: baseUrl + "admin/viewUserSubscriptionDetails",
    buyPlanUsers: baseUrl + "buy/get-plan-for-users",
    getPlans: baseUrl + "buy/getTradingBotDetails",
}