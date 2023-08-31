import I1 from '../img/light1.png'
import I2 from '../img/watertrans.png'
import I3 from '../img/plant.png'
import I4 from '../img/humidity.png'

export const heropData = [
    { id: 1, name: 'Simulated Controlled Sunlight', imageSrc: I1},
    { id: 2, name: 'Automated Watering & Fertilizing', imageSrc: I2 },
    { id: 3, name: 'Controlled Interior Temperature ', imageSrc: I3 },
    { id: 4, name: 'Controlled Interior Humidity ', imageSrc: I4 },
];

export const categories = [
    {
      id: 1,
      name: "Bulbous",
      urlParamName: "bulbous",
    },
    {
      id: 2,
      name: "Foliage",
      urlParamName: "foliage",
    },
    {
      id: 3,
      name: "Succulent",
      urlParamName: "succulent",
    },
    {
      id: 4,
      name: "Fern",
      urlParamName: "fern",
    },
    {
      id: 5,
      name: "Flowering",
      urlParamName: "flowering",
    },
    {
      id: 6,
      name: "Cactus",
      urlParamName: "cactus",
    },
    {
      id: 7,
      name: "Other",
      urlParamName: "other",
    },
  ];

export const soilMoistValues = [
  {
    id:1,
    name: "Partially dry",
    moist: "515",
  },
  {
    id:2,
    name: "Fully dry",
    moist: "850",
  },
  {
    id:3,
    name: "Fully moist",
    moist: "475",
  },
  {
    id:4,
    name: "water Once a week",
    moist: "1020",
  }
];
  
