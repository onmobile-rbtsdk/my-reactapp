const oldBody: any = {
  margin: document?.body?.style?.margin,
  border: document?.body?.style?.border,
  overflow: document?.body?.style?.overflow,
  display: document?.body?.style?.display,
};

export const resetStyleBody = () => {
  if (document.body) {
    ["margin", "border", "overflow", "display"].forEach((property: string) => {
      if (oldBody[property]) {
        document.body.style.setProperty(property, oldBody[property]);
      } else {
        document.body.style.removeProperty(property);
      }
    });
  }
};
