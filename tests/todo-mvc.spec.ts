import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

const TODO_ITEMS: string[] = [
  'feed the cat',
  'cleanup kitchen',
  'prepare steaks',
];

test.describe('Todo app', (): void => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }): Promise<void> => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test.describe('Check overall app', (): void => {
    test('Page should have title', async ({ page }): Promise<void> => {
      await expect(page).toHaveTitle(/TodoMVC.*/);
    });

    test('Page should have proper URL', async ({ page }): Promise<void> => {
      await expect(page).toHaveURL(/.*todomvc.*/);
    });
  });

  test.describe('Add new todo', (): void => {
    test('Should let me add new todo', async (): Promise<void> => {
      for (const todo of TODO_ITEMS) {
        await todoPage.addTodoItem(todo);
      }

      await todoPage.checkTodoItemListLength(TODO_ITEMS.length);

      for (const todoItem of TODO_ITEMS) {
        await todoPage.checkTodoItemListContainTodo(todoItem);
      }
    });

    test('Should update todo count correctly', async (): Promise<void> => {
      for (const [index, todo] of TODO_ITEMS.entries()) {
        await todoPage.addTodoItem(todo);
        await todoPage.checkTodoItemsCounter(todo, index);
      }
    });

    test('TODO input is empty when new todo is created', async (): Promise<void> => {
      await todoPage.addTodoItem(TODO_ITEMS[0]);
      await expect(todoPage.todoInput).toBeEmpty();
    });
  });

  test.describe('Manage TODOs', () => {
    test('User can mark TODO as completed', async (): Promise<void> => {
      await todoPage.addTodoItem(TODO_ITEMS[0]);
      await todoPage.markTodoItemAsCompleted(0);
    });
  });
});
