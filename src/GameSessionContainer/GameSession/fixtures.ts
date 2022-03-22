import * as React from "react";
import routerData from "react-router";

export const mockLocation = {
  pathname: "/me",
};

export const mockHistory = {
  location: {
    pathname: "/battles/select-game",
    search: "?edgeNodeId=1&startAt=3&battle=true",
  },
  push: jest.fn(),
  createHref: "",
  replace: jest.fn(),
  him: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  listen: jest.fn(),
  block: jest.fn(),
  goBack: jest.fn(),
};

export const gameSession = {
  controller: "",
  createdAt: "2021-04-06T11:16:37.587Z",
  edgeNodeId: "e922d714-6a10-4196-a65a-20045652dda8",
  host: {
    avatar: "https://onmo-public.s3.amazonaws.com/public/Avatar/mobile/Mask-14.png",
    banner: "https://onmo-public.s3.amazonaws.com/public/Cover/mobile/Cover_1065x444px_6",
    createdAt: "2021-03-05T07:49:20.739Z",
    currency: 300,
    email: null,
    facebookId: null,
    googleId: null,
    id: "185149b0-7f68-4bf2-9209-2690943cf34c",
    online: null,
    phone: null,
    pushSubscription: null,
    updatedAt: "2021-03-14T06:07:46.680Z",
    username: "Linh :v",
    xp: 0,
  },
  id: "c7900e08-cf39-499a-a517-f6464b548860",
  incognito: false,
  isStreamReady: false,
  matchId: null,
  moment: {
    app: {
      category: "Arcade",
      description: "Help Jake, Tricky & Fresh escape from the grumpy Inspector and his dog.",
      id: "152144",
      status: "LIVE",
      timesPlayed: 4636,
      title: "Subway Surfers: Barcelona",
      type: null,
    },
    appId: "152144",
    description: "Get the most coins within the time limit",
    id: "3366ff80-212d-4980-8e41-c34526d01ff1",
    momentType: "ZEN",
    snapshotId: "16a75555-617e-462f-814d-38dde4fad7f9",
    timesPlayed: 1854,
    title: "Most coins",
    type: "coins",
  },
  sessionResults: "",
  sessionType: "CASUAL",
  updatedAt: "2021-04-06T11:16:37.587Z",
};

export const mockUseHistory = () => {
  jest.spyOn(routerData, "useHistory").mockReturnValue(mockHistory as never);
  jest.spyOn(routerData, "useLocation").mockReturnValue(mockLocation as never);
};

export const mockUseEffect = () => {
  const useEffect = jest.spyOn(React, "useEffect");
  useEffect.mockImplementationOnce((f: any) => f());
};

export const mockUseState = () => {
  let useState: any;
  useState = jest.spyOn(React, "useState");
  const setState = jest.fn();
  useState.mockImplementationOnce((init: any) => [init, setState]);
};

export const mockGetElementsByTagName = {
  length: 120,
};
