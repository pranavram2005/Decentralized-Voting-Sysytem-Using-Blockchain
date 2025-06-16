    import { useState } from "react";

    const AddCandidate = (props)=>{
        return(<>
            <div className="p-4 bg-gray-100 rounded shadow-md">
              <input
                type="text"
                value={props.candidate}
                onChange={props.changeCandidate}
                className="w-full px-4 py-2 mb-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={props.addCandidate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </>
          )
    }
    export default AddCandidate;