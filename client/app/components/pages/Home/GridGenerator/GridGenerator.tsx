import chunk from "lodash/chunk";
import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

type GridGeneratorProps = {
  cols: 1 | 2 | 3 | 4 | 6 | 12;
};

const GridGenerator: React.FC<GridGeneratorProps> = ({ cols, children }) => {
  const colWidth = 12 / cols;
  const rows = chunk(React.Children.toArray(children), cols);

  return (
    <>
      {rows.map((cols, idx) => (
        <Row key={idx}>
          {cols.map((col, idx) => (
            <Col key={idx} sm={12} md={colWidth} className="mb-3">
              {col}
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
};

export default GridGenerator;
