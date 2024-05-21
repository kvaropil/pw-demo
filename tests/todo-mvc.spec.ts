import { test, expect, Locator } from '@playwright/test';
import * as baseSelectors from '../helpers/selectors/base'

const TODO_ITEMS: string[] = [
    'feed the cat',
    'cleanup kitchen',
    'prepare steaks'
]

test.beforeEach(async ({ page }) => {
    await page.goto('/examples/react/dist/');
})

test.describe('Todo app', () => {
    let todoInput: Locator;
    let todoCounter: Locator;
    let todoList: Locator;

    test.beforeEach(async ({ page }) => {
        todoInput = page.getByPlaceholder('What needs to be done?');
        todoCounter = page.locator(baseSelectors.todoCount);
        todoList = page.getByTestId(baseSelectors.todoList);
    });

    test.describe('Check overall app', () => {
        test('Page should have title', async ({ page }) => {
            await expect(page).toHaveTitle(/TodoMVC.*/);
        })

        test('Page should have proper URL', async ({ page }) => {
            await expect(page).toHaveURL(/.*todomvc.*/);
        })
    })

    test.describe('Add new todo', () => {
        test('Should let me add new todo', async ({ page }) => {

            for (const todo of TODO_ITEMS) {
                await todoInput.fill(todo)
                await todoInput.press('Enter')
            }

            const todoListItems: Locator = page.getByTestId(baseSelectors.todoItem)

            await expect(todoListItems).toHaveCount(TODO_ITEMS.length)

            for (const todo of TODO_ITEMS) {
                await expect(todoList).toContainText(todo)
            }

        })

        test('Should update todo count correctly', async () => {
            for (let [index, todo] of TODO_ITEMS.entries()) {
                await todoInput.fill(todo)
                await todoInput.press('Enter')

                const itemCount = index + 1;
                const expectedText = `${itemCount} item${itemCount > 1 ? 's' : ''} left!`;

                await expect(todoCounter).toHaveText(expectedText);
            }
        })


        test('TODO input is empty when new todo is created', async () => {

            await todoInput.fill(TODO_ITEMS[0])
            await todoInput.press('Enter')

            await expect(todoInput).toBeEmpty()
        })

    })

    test.describe('Manage TODOs', () => {
        test('User can mark TODO as completed', async ({ page }) => {
            await todoInput.fill(TODO_ITEMS[0])
            await todoInput.press('Enter')

            const todoItem: Locator = page.getByTestId(baseSelectors.todoItem)
            const todoItemToggle: Locator = page.getByTestId(baseSelectors.todoItemToggle)

            await todoItemToggle.click()
            await expect(todoItem).toHaveClass('completed')
        })

    })
})



