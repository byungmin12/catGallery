export default function Nodes({ $app, initialState, onClick }) {
  this.state = initialState;
  this.$target = document.createElement("ul");
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    console.log(nextState);
    this.state = nextState;
    this.render();
  };

  this.onClick = onClick;

  this.render = () => {
    if (this.state.nodes) {
      const nodesTemplate = this.state.nodes
        .map((node) => {
          const iconPath =
            node.type === "FILE"
              ? "../../assets/file.png"
              : "../../assets/directory.png";
          console.log(node);
          return `
                    <div class="Node" data-node-id="${node.id}">
                        <img src="${iconPath}" />
                        <div>${node.name}</div>
                    </div>
                `;
        })
        .join("");
      this.$target.innerHTML = !this.state.isRoot
        ? `<div class="Node"><img src="../../assets/prev.png"/></div>${nodesTemplate}`
        : nodesTemplate;
    }
    this.$target.querySelectorAll(".Node").forEach(($node) => {
      $node.addEventListener("click", (e) => {
        //e.target.dataset으로 위에서 data-로 시작하는 props에 접근할 수 있음
        const { nodeId } = e.target.closest("[data-node-id]").dataset;
        const selectedNode = this.state.nodes.find(
          (node) => node.id === nodeId
        );

        if (selectedNode) {
          this.onClick(selectedNode);
        }
      });
    });
  };

  this.render();
}
