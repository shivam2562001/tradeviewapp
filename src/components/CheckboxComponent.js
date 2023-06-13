

function CheckboxComponent({label,isChecked,index,handleOnChange}) {
  return (
    <label key={label} className="form-control ">
    <input type="checkbox" name="checkbox-checked" checked={isChecked} onChange={() => handleOnChange(index)} />
     <span className="pl-2">{label}</span>
  </label>
  )
}

export default CheckboxComponent