import "./App.css";
import { useState, useEffect } from "react";

const App = () => {
  const [num, setNum] = useState(3);
  const [colors, setColors] = useState(["#ff0000", "#00ff00", "#0000ff"]);
  const [maxSize, setMaxSize] = useState(500);
  const [sizes, setSize] = useState([33, 66]);
  const [url, setURL] = useState("");

  const setRange = (e, n) => {
    const s = sizes.map((v) => Number(v));
    s[n] = e.target.value;
    if (n > 0 && s[n - 1] >= s[n]) s[n] = s[n - 1] + 1;
    else if (n < sizes.length - 1 && s[n + 1] <= s[n]) s[n] = s[n + 1] - 1;
    setSize(s);
  };
  return (
    <>
      <RangeIn size={maxSize} onChange={setRange} sizes={sizes} />
      <Pyramid
        className="Pyramid"
        number={num}
        colors={colors}
        size={maxSize}
        sizes={sizes.map((s) => (maxSize / 100) * s)}
        setURL={setURL}
      />
      <Colors
        className="Colors"
        colors={colors}
        size={maxSize}
        onChange={(e, n) => {
          const c = [...colors];
          c[n] = e.target.value;
          setColors(c);
        }}
      />
      <div className="clear" />
      <br />
      <Add
        onClick={() => {
          setColors([...colors, "#eb7012"]);
          setSize([...Array(num)].map((_, i) => (100 / (num + 1)) * (i + 1)));
          setNum(num + 1);
        }}
      />
      <Download url={url} />
    </>
  );
};

const Download = (props) => {
  return (
    <a href={props.url} download="pyramid.png">
      <button>ダウンロード</button>
    </a>
  );
};

const Colors = (props) => {
  return (
    <div>
      {props.colors.map((c, i) => {
        return (
          <>
            <input
              key={i}
              type="color"
              value={c}
              onChange={(e) => {
                props.onChange(e, i);
              }}
            />
            <br />
          </>
        );
      })}
    </div>
  );
};

const Add = (props) => {
  return (
    <>
      <button onClick={props.onClick}>追加</button>
    </>
  );
};

const RangeIn = (props) => {
  return (
    <div className="slidebar-multithumb" style={{ marginTop: props.size / 2 }}>
      {props.sizes.map((v, i) => {
        return (
          <input
            key={i}
            className="thmub"
            type="range"
            value={v}
            min="0"
            max="100"
            step="1"
            style={
              i === 0
                ? {
                    width: props.size,
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    border: "1px solid",
                  }
                : { width: props.size, backgroundColor: "rgba(0, 0, 0, 0)" }
            }
            onChange={(e) => {
              props.onChange(e, i);
            }}
          />
        );
      })}
    </div>
  );
};

function Pyramid(props) {
  const [context, setContext] = useState([]);
  useEffect(() => {
    const c = document.getElementById("canvas");
    const ctx = [];
    const num = props.number;
    for (let i = 0; i < num; i++) {
      ctx.push(c.getContext("2d"));
    }
    setContext(ctx);
  }, [props]);
  useEffect(() => {
    const colors = props.colors;
    console.log(colors);
    const sizes = [...props.sizes];
    sizes.push(props.size);
    console.log(context);
    const canvasWidth = document.getElementById("canvas").width;
    for (let i = context.length - 1; i >= 0; i--) {
      const height = sizes[i];
      context[i].beginPath();
      context[i].moveTo(canvasWidth / 2, 0);
      context[i].lineTo(
        canvasWidth / 2 - height * Math.sin(Math.PI / 6),
        height
      );
      context[i].lineTo(
        canvasWidth / 2 + height * Math.sin(Math.PI / 6),
        height
      );
      context[i].closePath();
      context[i].stroke();
      context[i].fillStyle = colors[i];
      context[i].fill();
    }
    props.setURL(document.getElementById("canvas").toDataURL("image/png"));
  }, [context, props]);
  return (
    <canvas
      width={2 * props.size * Math.sin(Math.PI / 6)}
      height={props.size}
      id="canvas"
    ></canvas>
  );
}

export default App;
