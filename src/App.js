import { request } from "./api/api.js";
import Nodes from "./components/Nodes.js";
import BreadCrumb from "./components/BreadCrumb.js";
import ImageView from "./components/ImageView.js";

export default function App($app) {
  //저장소 state
  this.state = {
    isRoot: false,
    nodes: [],
    depth: [],
    selectFilePath: null,
  };

  const imageView = new ImageView({
    $app,
    initialState: this.state.selectFilePath,
  });

  const breadCrumb = new BreadCrumb({
    $app,
    initialState: this.state.depth,
  });

  const nodes = new Nodes({
    $app,
    initialState: [],
    onClick: async (node) => {
      console.log(node);

      try {
        if (node.type === "DIRECTORY") {
          //DIRECTORY
          const nextNodes = await request(node.id);
          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: nextNodes,
            isRoot: false,
          });
        } else if (node.type === "FILE") {
          //FILE
          this.setState({
            ...this.state,
            selectFilePath: node.filePath,
          });
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    onBackClick: async () => {
      try {
        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;

        if (prevNodeId === null) {
          const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: rootNodes,
          });
        } else {
          const prevNodes = await request(prevNodeId);
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: prevNodes,
          });
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;
    breadCrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    imageView.setState(this.state.selectFilePath);
  };

  const init = async () => {
    try {
      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });
    } catch (err) {
      throw new Error(err);
    }
  };
  init();
}
