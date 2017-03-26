# Restaurant Ordering Problem
#### Al Whiting; alwhiting@gmail.com

## Setup
### Pre-Reqs:
* NodeJS version 6.10.1 minimum; this is the version tested.

### Install Steps:
1. clone the git repository somewhere.
2. change directory to the project root.
3. install required libraries (all related to testing) by running: `npm install`

## Running
### Simple processing of JSON
The default mode of operation is to read a specified JSON file. This is simple and effective however I would recommend using the feature tests to create more scenarios.

To process a JSON file: `node src <file path>`

A JSON version of the sample input is included in `/json-input` and can be run by:
`node src ./json-input/given-example.json`

### Unit tests
There are reasonably extensive unit tests in the `/test/unit` directory. To run these: `npm test`

### Feature tests
To test a variety of scenarios in a readable and efficient way a dozen or so feature tests are included implemented using [Cucumber](https://cucumber.io/).

To run these: `npm run feature-test`

For example, the sample input provided with the problem is represented in: `/test/features/given-example.feature`
Feel free to create more to try and break the implementation!

## Implementation Notes
This is implemented in NodeJS (6.10.1). I have been working primarily with Node over the past couple of years however much of that has been only loosely object-oriented and this felt like a good chance to play around with some of the new class support in ES6 while still remaining on familiar ground for the sample project/question.

### Assumptions
#### Input Cleansing
I assumed input cleansing would be done outside of this implementation. For example normally when implementing an application inputs are cleansed at the edge and when you are into the domain logic it's usually reasonable to assume any bad input has been handled at the appropriate point.

That said the command line interface provides basic protection against invalid input however I don't consider that piece to be part of the core implementation.

#### Restricted Meal Types
I opted to allow any string to be an acceptable meal restriction; not just the values listed in the question. There are pros and cons to this. The obvious pro is that you can restrict based on anything. The downside is it requires some careful handling, especially in Javascript, where using some kind of reserved value for 'unrestricted' meals could result in clever users specifying that value as an input.

#### Restaurant Names
Assumed to be unique.

### General Notes

#### Inputs/Outputs and state separation
I have kept the requested orders input and output separate from the restaurant state. This has a few advantages in my opinion:

* class relationships are clearly defined and state is as self contained as possible.

* multiple orders can be placed against a shared set of restaurants without interfering with each other.

* the original request is left intact which can be useful for historical and debugging purposes.

* the output while not truly immutable is essentially static; it can be kept around for historical or debugging purposes.

#### Quick overview of classes
* Restaurant (`/src/restaurant`); a restaurant with name, rating, total available meals and available restricted meals. Orders are made against Restaurant instances.

* Meals (`/src/restaurant/meals`); a set of same restriction-type meals with an available quantity, type can be any string as discussed above or none. Restaurant contains a map of these to track it's available quantities.

* MealsRequest (`/src/automated-orders/meals-request`); input/request object for a quantity of a particular meal type. Maintains it's state of how much of the request has been satisfied.

* OrderRequest (`/src/automated-orders/order-request`); input/request object which contains MealsRequest instances that describe how many of each meal type has been requested.

* RestaurantOrder (`/src/automated-orders/restaurant-order`); final output object, one per Restaurant to be ordered from. Describes how many of each type of meal should be ordered from that Restaurant.

* AutomatedOrders (`/src/automated-orders`); brings the pieces together (Restaurants, OrderRequest) and outputs RestaurantOrder instances.
