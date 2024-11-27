import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getTodos, addTodo, updateTodo, deleteTodo, updateProject } from '../services/api';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);  // State to track which todo is being edited
  const [editTitle, setEditTitle] = useState('');  // State for the new title during editing
  const [projectTitle, setProjectTitle] = useState(location.state?.title || "Project"); // Default title if not passed
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    loadTodos();
  }, [projectId]);  // Added projectId dependency to reload todos if the projectId changes

  const loadTodos = async () => {
    try {
      const response = await getTodos(projectId);
      setTodos(response.data || []);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  // Function to generate markdown summary
const generateMarkdownSummary = () => {
  let markdown = `# ${projectTitle}\n\n`;
  markdown += `## Summary: ${completedTodos.length}/${todos.length} todos completed.\n\n`;
  
  markdown += `### Section 1: Pending Todos\n`;
  pendingTodos.forEach(todo => {
    markdown += `- [ ] ${todo.description}\n`;
  });

  markdown += `\n### Section 2: Completed Todos\n`;
  completedTodos.forEach(todo => {
    markdown += `- [x] ${todo.description}\n`;
  });

  return markdown;
};

// Function to save the generated markdown file to the local system
const saveMarkdownToFile = (markdown) => {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ProjectSummary.md';  // Name the file as needed
  link.click();
};
// Export Summary Function
const exportSummary = (todos) => {
  const markdown = generateMarkdownSummary(todos);
  saveMarkdownToFile(markdown);
  alert('Your project summary has been saved as ProjectSummary.md!');
};



  const handleUpdateProject = async (newTitle) => {
    try {
      const response = await updateProject(projectId, newTitle);
      console.log('Project updated successfully:', response.data);
      setProjectTitle(newTitle); // Update the project title with the new one
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleEditTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleSaveEditTitle = () => {
    handleUpdateProject(projectTitle); // Save the new title
    setIsEditingTitle(false); // Exit editing mode
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setProjectTitle(location.state?.title || "Project"); // Reset to original title
  };


  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return; // Prevent adding empty todos
    const newTodo = { description: newTodoTitle, completed: false, projectId };
    try {
      await addTodo(newTodo);
      setNewTodoTitle('');
      loadTodos(projectId); // Refresh the todos list
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEditClick = (todo) => {
    setEditTodoId(todo.id);
    setEditTitle(todo.description);  // Populate the input field with the current title
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      const updatedTodo = { ...todos.find(todo => todo.id === editTodoId), description: editTitle };
      await updateTodo(updatedTodo);
      setEditTodoId(null);  // Clear the editing state
      setEditTitle('');
      loadTodos(projectId);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTodoId(null); // Reset editing ID
    setEditTitle(''); // Clear the input field
  };
  

  // Toggle the completed status of a todo
  const handleCheckboxChange = async (todoId) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos); // Update state with modified todos

    // Optionally update on the server if using an API
    try {
      const updatedTodo = updatedTodos.find((todo) => todo.id === todoId);
      await updateTodo(updatedTodo); // Assuming updateTodoStatus sends the updated todo to API
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId); 
      setTodos(todos.filter((todo) => todo.id !== todoId)); // Remove the todo from the state
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex align-items-center mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="form-control me-2"
            placeholder="Edit Project Title"
          />
        ) : (
          <h1 className="me-3">{projectTitle}</h1>
        )}
        <button
          onClick={handleEditTitleClick}
          className="btn btn-outline-primary btn-sm"
        >
          ✏️
        </button>
      </div>
  
      {/* Save and Cancel Buttons for Editing Title */}
      {isEditingTitle && (
        <div className="mb-3">
          <button className="btn btn-success me-2" onClick={handleSaveEditTitle}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancelEditTitle}>
            Cancel
          </button>
        </div>
      )}
  
      {/* Summary Section */}
      <p className="text-muted">
        <strong>Summary:</strong> {completedTodos.length}/{todos.length} todos
        completed
      </p>
  
      {/* Add New Todo */}
      <h2 className="text-primary">Add New Todo</h2>
      <div className="d-flex mb-4">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="form-control me-2"
          placeholder="New Todo Title"
        />
        <button onClick={handleAddTodo} className="btn btn-primary">
          Add Todo
        </button>
      </div>
  
      {/* Pending Todos */}
      <h2 className="text-secondary">Pending Todos</h2>
      <ul className="list-group mb-4">
        {pendingTodos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex align-items-center"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo.id)}
              className="me-3"
            />
            {editTodoId === todo.id ? (
              <div className="d-flex w-100">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-control me-2"
                  placeholder="Edit Todo Title"
                />
                <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between w-100">
                <div style={{ flex: 1, marginLeft: '10px' }}>
                  <span>{todo.description}</span>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    Created: {new Date(todo.createdDate).toLocaleDateString()} | Last Updated: {new Date(todo.updatedDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleEditClick(todo)}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
  
      {/* Completed Todos */}
      <h2 className="text-success">Completed Todos</h2>
      <ul className="list-group mb-4">
        {completedTodos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex align-items-center"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo.id)}
              className="me-3"
            />
            {editTodoId === todo.id ? (
              <div className="d-flex w-100">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-control me-2"
                  placeholder="Edit Todo Title"
                />
                <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between w-100">
                <div style={{ flex: 1, marginLeft: '10px' }}>
                  <span>{todo.description}</span>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    Created: {new Date(todo.createdDate).toLocaleDateString()} | Last Updated: {new Date(todo.updatedDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleEditClick(todo)}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
  
      {/* Export Project Summary */}
      <button onClick={() => exportSummary(todos)} className="btn btn-warning">
        Export Project Summary
      </button>
    </div>
  );    
};

export default ProjectDetails;
