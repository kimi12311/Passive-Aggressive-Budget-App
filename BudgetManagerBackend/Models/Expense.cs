namespace BudgetManagerBackend.Models;

public class Expense
{
    public int ExpenseId { get; set; }
    public int Cost { get; set; }
    public string Label { get; set; }
    public string Category { get; set; }
    public int UserId { get; set; }
}