using MyCash.API.Models;
using System.ComponentModel.DataAnnotations;

namespace MyCash.API.DTOs.Transactions;

    public class CreateTransactionRequest
    {
     public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    [EnumDataType(typeof(TransactionType), ErrorMessage = "Invalid transaction type. Only 0 or 1 are allowed.")]
    public TransactionType Type { get; set; }
}

