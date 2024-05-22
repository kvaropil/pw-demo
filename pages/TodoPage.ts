import { expect, Locator, Page } from '@playwright/test';
import * as baseSelectors from '../helpers/selectors/base';

export class TodoPage {
  readonly page: Page;
  readonly todoInput: Locator;
  readonly todoCounter: Locator;
  readonly todoList: Locator;
  readonly todoListItems: Locator;
  readonly todoItemToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.todoCounter = page.locator(baseSelectors.todoCount);
    this.todoList = page.getByTestId(baseSelectors.todoList);
    this.todoListItems = page.getByTestId(baseSelectors.todoItem);
    this.todoItemToggle = page.getByTestId(baseSelectors.todoItemToggle);
  }

  async goto() {
    await this.page.goto(`/examples/react/dist/`);
  }

  async addTodoItem(todoText: string) {
    await this.todoInput.fill(todoText);
    await this.todoInput.press('Enter');
  }

  async checkTodoItemListContainTodo(expectedTodoText: string) {
    await expect(this.todoList).toContainText(expectedTodoText);
  }

  async checkTodoItemsCounter(todoItem: string, todoIndex: number) {
    const itemCount = todoIndex + 1;
    const expectedText = `${itemCount} item${itemCount > 1 ? 's' : ''} left!`;

    await expect(this.todoCounter).toHaveText(expectedText);
  }

  async checkTodoItemListLength(expectedLength: number) {
    await expect(this.todoListItems).toHaveCount(expectedLength);
  }

  async markTodoItemAsCompleted(index: number) {
    await this.todoItemToggle.nth(index).click();

    await expect(this.todoListItems.nth(index)).toHaveClass('completed');
  }
}
