using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BudgetManagerBackend.Models;

namespace BudgetManagerBackend.Controllers
{
    [Route("api/Expense")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly BudgetContext _context;

        public BudgetController(BudgetContext context)
        {
            _context = context;
        }

        [HttpGet("User/{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("User/Name/{name}")]
        public async Task<ActionResult<User>> GetUserByName(string name)
        {
            var user = await _context.Users.Where(x => x.UserName == name).ToListAsync();
            if (user.Any()) return user.First();
            var newUser = await PostUser(new User()
            {
                UserId = 0,
                UserName = name
            });
                
            return newUser;
        }

        [HttpGet("User")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
        
        [HttpPost("User")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [HttpPut("User/{id}/Budget/{budget}")]
        public async Task<ActionResult<User>> PutBudget(int id, int budget)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Budget = budget;
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(int userId)
        {
            return await _context.Expense.Where(x => x.UserId == userId).ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int id)
        {
            var expense = await _context.Expense.FindAsync(id);

          if (expense == null)
          {
              return NotFound();
          }

          return expense;
        }
        
        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(Expense expense)
        {
            _context.Expense.Add(expense);
          await _context.SaveChangesAsync();

          return CreatedAtAction("GetExpense", new { id = expense.ExpenseId }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpense(int id)
        {
            var user = await _context.Expense.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Expense.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
