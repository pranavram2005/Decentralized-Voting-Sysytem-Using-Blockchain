import AddCandidate from "./AddCandidate";

const Connected = (props)=>{
    return(<>
        <div className="p-4 bg-gray-100 rounded shadow-md">
          <p className="text-2xl font-semibold">Address: <i className="text-xl">{props.account}</i></p>
          <button
            onClick={props.fetchVoters}
            className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          >
            Get Candidates
          </button>
          <div>{props.renderCountdown()}</div>
          {props.status ? (
            <p className="text-red-500">Already Voted</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Index</th>
                    <th className="px-4 py-2">Candidate</th>
                    <th className="px-4 py-2">Votes</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {props.voteList ? (
                    props.voteList.map((candidate, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{candidate.name}</td>
                        <td className="px-4 py-2">{candidate.voteCount.toNumber()}</td>
                        <td className="px-4 py-2">
                          {props.status ? null : (
                            <button
                              onClick={() => props.vote(index)}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                            >
                              Vote
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-center">
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
      )
}
export default Connected;