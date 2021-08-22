var actionTypes = [
  {
    id: "1",
    title: "Face",
    type: "face",
    fields: [],
  },
  {
    id: "2",
    title: "2D pocket",
    type: "2d_pocket",
    fields: [
      {
        label: "Field Label",
        inputType: "number",
        inputName: "inputName",
      },
      {
        label: "Face",
        inputType: "face",
        inputName: "pocket_face",
      },
    ],
  },
];

export default actionTypes;
