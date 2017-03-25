Feature: Ordering unrestricted meals only

  Scenario: Order 50 from single restaurant that has enough capacity
    Given we wish to order 50 meals
    And restaurant "A" has a rating of 5 and can serve a total of 100 meals
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 50 unrestricted meals
    And we expect no orders to be unsatisfied
    And restaurant "A" has 50 meals left

  Scenario: Order 50 from single restaurant that does not have enough capacity
    Given we wish to order 50 meals
    And restaurant "A" has a rating of 5 and can serve a total of 20 meals
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 20 unrestricted meals
    And we expect 30 unrestricted meals are unsatisfied
    And restaurant "A" has no meals left

  Scenario: Order 50 from three restaurants; paying attention to the remainder based on rating
    Given we wish to order 50 meals
    And restaurant "A" has a rating of 1 and can serve a total of 60 meals
    And restaurant "B" has a rating of 2 and can serve a total of 10 meals
    And restaurant "C" has a rating of 3 and can serve a total of 5 meals
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "C" 5 unrestricted meals
    And we expect to order from restaurant "B" 10 unrestricted meals
    And we expect to order from restaurant "A" 35 unrestricted meals
    And restaurant "C" has no meals left
    And restaurant "B" has no meals left
    And restaurant "A" has 25 meals left
    And we expect no orders to be unsatisfied

  Scenario: Order 50 from three restaurants where there is still not enough capacity
    Given we wish to order 50 meals
    And restaurant "A" has a rating of 1 and can serve a total of 20 meals
    And restaurant "B" has a rating of 2 and can serve a total of 10 meals
    And restaurant "C" has a rating of 3 and can serve a total of 5 meals
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "C" 5 unrestricted meals
    And we expect to order from restaurant "B" 10 unrestricted meals
    And we expect to order from restaurant "A" 20 unrestricted meals
    And restaurant "C" has no meals left
    And restaurant "B" has no meals left
    And restaurant "A" has no meals left
    And we expect 15 unrestricted meals are unsatisfied

  Scenario: Try to order from a restaurant that is already out of meals
    Given we wish to order 50 meals
    And restaurant "A" has a rating of 1 and can serve a total of 0 meals
    When we use the automated-orders app to determine the best possible orders
    Then we expect the results to be empty
    And we expect 50 unrestricted meals are unsatisfied
