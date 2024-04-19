import React, { useCallback, useState } from 'react';
import ReactFlow, { Controls, MiniMap, Background, useNodesState, useEdgesState, addEdge, EdgeText } from 'reactflow';
import './home.css';
import 'reactflow/dist/style.css';
 
export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currText, setText] = useState("");
  const [currId, setId] = useState(1);
  const [currPosX, setPosX] = useState(400);
  const [currPosY, setPosY] = useState(400);
 
  

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeMouseEnter = (event, node) => {
    if(node.special)
      return;
    setNodes(currNodes =>
      currNodes.map(currNode => {
        if (currNode.id === node.id) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Node id={node.id} data={node.extraLabel} hover={true} />
            }
          };
        }
        return currNode;
      })
    );
  };

  const onNodeMouseLeave = (event, node) => {
    if(node.special)
      return;
    setNodes(currNodes =>
      currNodes.map(currNode => {
        if (currNode.id === node.id) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Node id={node.id} data={node.extraLabel} hover={false} />
            }
          };
        }
        return currNode;
      })
    );
  };

  const onEdgeMouseEnter = (event, edge) => {
    setEdges(currEdge =>
      currEdge.map(currEdge => {
        if (currEdge.id === edge.id) {
          return {
            ...currEdge,
            label : "X"
          };
        }
        return currEdge;
      })
    );
  };

  const onEdgeMouseLeave = (event, edge) => {
    setEdges(currEdge =>
      currEdge.map(currEdge => {
        if (currEdge.id === edge.id) {
          return {
            ...currEdge,
            label: null,
          };
        }
        return currEdge;
      })
    );
  };

  function handleDelete(id) {
    setEdges((currEdges) =>
      currEdges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  
    setNodes((currNodes) =>
      currNodes.filter((node) => node.id !== id)
    );
  }

  const onEdgeClick = (event, edge) => {
    handleDeleteEdge(edge.id);
  }

  function onNodeClick( id ){
    setNodes((curr) => {
      curr = [...curr , 
              { 
                id : currId.toString(), 
                position: { x: currPosX, y: currPosY }, 
                data: {label: <Edit editId={id} myId={currId.toString()}/>},
                special : true,
              }];
      setId(currId+1);
      setPosX(700);
      setPosY(0);
      return curr;
    })
  }

  function handleDeleteEdge(id) {
    setEdges((currEdges) =>
      currEdges.filter((edge) => edge.id !== id)
    );
  }

  function handleAdd(){
    setNodes((curr) => {
      curr = [...curr , 
              { 
                id : currId.toString(), 
                position: { x: currPosX, y: currPosY }, 
                data: {label: <Node id = {currId.toString()} data = {currText} hover = {false}/>},
                extraLabel : currText
              }];
      setId(currId+1);
      setPosX(400 + (currPosX + 10)%100);
      setPosY(400 + (currPosY + 10)%100);
      return curr;
    })
  }

  function handleEdit(editId, myId, text){
    setNodes(currNodes =>
      currNodes.map(currNode => {
        if (currNode.id === editId) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Node id={editId} data={text} hover={false} />,
            },
            extraLabel:text
          };
        }
        return currNode;
      })
    );
    handleDelete(myId);
  }

  function Node(props) {
    return (
      <div>
        { props.hover ? 
          <div onClick={() => handleDelete(props.id)} className='cross'>&#x274C;</div>
          : <></>
        }
        <div onClick = {() => onNodeClick(props.id)} className={props.id + " node"}>
          {props.data}        
        </div>
      </div>
    );
  }
  function Edit(props) {
    const [editText, setEditText] = useState("");
    return (
      <div className='edit'>
        Edit Text
        <input onChange={(e) => setEditText(e.target.value) } className='inp'></input>
        <button onClick = {() => handleEdit(props.editId, props.myId, editText)}>Save</button>
      </div>
    );
  }


 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className='add-node'>
        <input calssname = "add-inp" onChange={(e) => setText(e.target.value)}></input>
        <button className = "add-btn" onClick = {() => handleAdd()}> Add Node </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeMouseEnter={onNodeMouseEnter} 
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter} 
        onEdgeMouseLeave={onEdgeMouseLeave}
        onEdgeClick={onEdgeClick}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}