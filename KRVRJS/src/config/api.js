export default {
  get: {
    // tools
    tool: "/tool",
    tools: "/tools",
    toolTypes: "/toolTypes",

    // actions
    action: "/action",
    actions: "/actions",
    actionTypes: "/actionTypes",

    // serial
    ports: "/serial/ports",
  },
  post: {
    postProcess: "/postProcess",
    convertStep: "/convert/step",

    // serial
    connectPort: "/serial/connect",
    disconnectPort: "/serial/disconnect",
    jog: "/serial/jog",
    asyncCommand: "/serial/asyncCommand",
    stop: "/serial/stop",
    pause: "/serial/pause",
    resume: "/serial/resume",
    unlock: "/serial/unlock",
  },
};
