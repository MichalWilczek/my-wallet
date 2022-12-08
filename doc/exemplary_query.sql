
WITH FilteredExpenses
AS
(
	SELECT money_flow_data_id 
	FROM Expense 
	WHERE expense_option_id = (
		SELECT id 
		FROM ExpenseOption 
		WHERE name = "food"
	)
)

SELECT SUM(MoneyFlowData.value)
FROM MoneyFlowData, FilteredExpenses
WHERE
	user_id = 1
	AND FilteredExpenses.id = MoneyFlowData.id
	AND date < "currentDate"
	AND date > "someHistoricalDate
