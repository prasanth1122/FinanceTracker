import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment/moment";
import TransactionTable from "../components/transactionTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
export default function Dashboard() {
  const transaction = [
    {
      type: "income",
      amount: 1200,
      tag: "salary",
      name: "income 1",
      date: "2024-29-01",
    },
    {
      type: "expense",
      amount: 800,
      tag: "food",
      name: "expense 1",
      date: "2024-30-01",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalvisisble] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalvisisble] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  function resetdata() {
    setTransactions([]);
    setTotalBalance(0);
    setExpense(0);
    setIncome(0);
  }
  const showExpenseModal = () => {
    setIsExpenseModalvisisble(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalvisisble(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalvisisble(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalvisisble(false);
  };
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log(docRef.id);
      if (!many) {
        toast.success("Transaction Added");
      }
      const newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      caluclateBalance();
    } catch (e) {
      if (!many) toast.error("Couldn't add transaction");
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [user]);
  useEffect(() => {
    caluclateBalance();
  }, [transactions]);
  function caluclateBalance() {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type == "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions fetched");
    }
    setLoading(false);
  }
  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            resetdata={resetdata}
          />
          {transactions && transactions.length !== 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}
