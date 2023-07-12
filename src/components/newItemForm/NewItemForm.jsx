
export default function NewItemForm({
    input,
    focused,
    onChange,
    onFocus,
    onBlur,
    onSubmit  
  }) {
  
    return (
      <form onSubmit={onSubmit}>
        <input
          value={input}
          className={focused && !input ? 'error' : ''}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button>Add</button> 
      </form>
    );
  }