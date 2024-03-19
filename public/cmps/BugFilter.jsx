const { useState, useEffect } = React

export function BugFilter({ onSetFilter, filterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    let { value, name: field, type } = target
    if (type === 'number') value = +value
    setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
  }

  return (
    <section>
      <h2>Filter bugs</h2>

      <form>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={filterByToEdit.title}
          onChange={handleChange}
          placeholder="By title"
        />

        <label htmlFor="minSeverity">Min severity</label>
        <input
          type="number"
          id="minSeverity"
          name="minSeverity"
          value={!!filterByToEdit.minSeverity || ''}
          onChange={handleChange}
          placeholder="By min severity"
        />

        <label htmlFor="labels">Label</label>
        <input
          type="text"
          id="label"
          name="label"
          value={filterByToEdit.label}
          onChange={handleChange}
          placeholder="By Label"
        />
      </form>
    </section>
  )
}
