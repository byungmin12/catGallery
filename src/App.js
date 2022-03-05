import { request } from "./api/api.js";
import Nodes from "./components/Nodes.js";
import BreadCrumb from "./components/BreadCrumb.js";

export default function App($app) {
  //저장소 state
  this.state = {
    isRoot: false,
    nodes: [],
    depth: [],
  };

  const breadCrumb = new BreadCrumb({
    $app,
    initialState: this.state.depth,
  });

  const nodes = new Nodes({
    $app,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    },
    onClick: async (node) => {
      try {
        if (node.type === "DIRECTORY") {
          //DIRECTORY
          const nextNodes = await request(node.id);
          this.setState({
            ...this.state,
            depth: [...this.state.depth.node],
            nodes: nextNodes,
          });
        } else if (node.type === "FILE") {
          //FILE
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
