import React from "react";
import "./styles.css";
import { Card, Row } from "antd";
import Button from "../Button";
export default function Cards({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance,
  resetdata,
}) {
  return (
    <div>
      <Row className="my_row">
        <Card bordered={true} className="my_card">
          <h2>Current Balance</h2>
          <p>${totalBalance}</p>
          <Button text="Reset Balance" blue={true} onClick={resetdata} />
        </Card>
        <Card bordered={true} className="my_card">
          <h2>Total Income</h2>
          <p>${income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card bordered={true} className="my_card">
          <h2>Total Expenses</h2>
          <p>${expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}
