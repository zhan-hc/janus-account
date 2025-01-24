
import { keepAccount, fetchAccountList, upateAccount, deleteAccount } from "@/api/account"
import { accountTypeCode } from "@/constant/account"
import { reactive, toRefs } from "vue"

export default function () {
  const state = reactive({
    typeId: accountTypeCode.expense,
    categoryId: null,
    accountList: []
  })

  const handleKeepAccount = async (data: any) => {
    await keepAccount(data)
  }

  const handleUpateAccount  = async (data: any) => {
    await upateAccount(data)
  }
  const handleDeleteAccount  = async (data: any) => {
    await deleteAccount(data)
  }
  function transformData(data) {
    const groupedData = data.reduce((acc, item) => {
        const date = item.account_time.split('T')[0];
        if (!acc[date]) {
            acc[date] = {
                date: date,
                list: [],
                income: 0,
                expense: 0
            };
        }
        acc[date].list.push(item);
        if (item.type_id === "10002") {
            acc[date].income += item.amount;
        } else if (item.type_id === "10003") {
            acc[date].expense += item.amount;
        }
        return acc;
    }, {});

    const result = Object.values(groupedData);
    result.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return result;
  }

  const getAccountList = async (params: { book_id: string, date: string }) => {
    const { data }: any = await fetchAccountList(params)
    state.accountList = transformData(data)
  }

  return {
    ...toRefs(state),
    getAccountList,
    handleKeepAccount,
    handleUpateAccount,
    handleDeleteAccount
  }
}