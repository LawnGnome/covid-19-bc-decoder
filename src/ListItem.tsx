import React from "react";

export interface Props {
  label: string;
  value?: string;
}

const ListItem: React.FunctionComponent<Props> = ({ label, value }) => {
  return (
    <>
      {value !== undefined && (
        <>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </>
      )}
    </>
  );
};

export default ListItem;
