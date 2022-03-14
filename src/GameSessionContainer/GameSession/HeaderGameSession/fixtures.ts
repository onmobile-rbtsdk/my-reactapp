import * as React from "react";

export const mockUseEffect = () => {
  let useEffect: any;
  useEffect = jest.spyOn(React, "useEffect");
  useEffect.mockImplementationOnce((f: any) => f());
};

export const mockUseLayoutEffect = () => {
  let useLayoutEffect: any;
  useLayoutEffect = jest.spyOn(React, "useLayoutEffect");
  useLayoutEffect.mockImplementationOnce((f: any) => f());
};

export const elementMock = { addEventListener: jest.fn() };
