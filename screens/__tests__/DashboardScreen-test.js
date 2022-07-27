import React from "react";
import renderer from "react-test-renderer";

import DashboardScreen from "../NotFoundScreen";

// const createTestProps = (props: Object) => ({
//     navigation: {
//       navigate: jest.fn()
//     },
//     ...props
//   });

const mockedDispatch = jest.fn();

// Mocks like this need to be configured at the top level 
// of the test file, they can't be setup inside your tests.
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
  };
});
describe("<App />", () => {
  beforeEach(() => {
    // Alternatively, set "clearMocks" in your Jest config to "true"
    mockedDispatch.mockClear();
  });

  it("has 1 child", () => {
    const tree = renderer.create(<DashboardScreen ></DashboardScreen>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
