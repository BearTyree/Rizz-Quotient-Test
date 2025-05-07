import React, { Fragment } from "react";
import Styles from "../styles/question.module.css";

export default function Question({ prompt, options, setAnswer, selected }) {
  return (
    <div id={Styles.container}>
      {prompt.split("\n").map((line, i) => (
        <div key={line + i}>
          {line.split("\t").map((segment, j) => (
            <Fragment key={segment + j}>
              {segment.split("*").map((piece, k) => (
                <Fragment key={piece + k + j}>
                  {(k + 1) / 2 == Math.floor((k + 1) / 2) ? (
                    <i>{piece}</i>
                  ) : (
                    <>{piece}</>
                  )}
                  {j < line.split("\t").length - 1 && (
                    <span style={{ marginLeft: "1rem" }}></span>
                  )}
                </Fragment>
              ))}
            </Fragment>
          ))}
          <br />
        </div>
      ))}
      <ol style={{ listStyleType: "none" }}>
        {options?.map((option, index) => (
          <li
            className={Styles.option}
            onClick={() => setAnswer(index)}
            key={prompt + "option" + index}
          >
            {selected == index ? (
              <Fragment key={index + option}>
                ({String.fromCharCode(65 + index)})
                <div
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    transform: "translate(3px, -2px)",
                    fontSize: "1.1em",
                  }}
                >
                  ⬤
                </div>
              </Fragment>
            ) : (
              <>({String.fromCharCode(65 + index)})</>
            )}
            <div className={Styles.optionText}>
              {option.text.split("*").map((piece, i) => (
                <Fragment key={piece + i + "*"}>
                  {(i + 1) / 2 == Math.floor((i + 1) / 2) ? (
                    <i>{piece}</i>
                  ) : (
                    <>{piece}</>
                  )}
                </Fragment>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// function Question({
//   number,
//   question,
//   options,
//   submitAnswer,
//   propanswer,
//   goBackQuestion,
//   final,
//   questionId,
// }) {
//   const [answer, setAnswer] = useState(propanswer);
//   useEffect(() => {
//     console.log(
//       'answer: ' + answer + ' propanswer:' + JSON.stringify(propanswer)
//     );
//   });

//   return (
//     <>
//       <div className='flex row'>
//         {number + '.'}&emsp;&emsp;
//         <div>
//           {question.split('\n').map((line, index) => (
//             <span key={index + 30}>
//               {line}
//               <br />
//             </span>
//           ))}
//         </div>
//       </div>
//       <br />
//       <div className='flex'>
//         <div>&ensp;&emsp;&emsp;&emsp;</div>
//         <ol className='list-[upper-alpha]' type='A'>
//           {options.map((option, index) =>
//             answer == index ? (
//               <>
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setAnswer(null);
//                   }}
//                 >
//                   <div className='rounded-full border-black border-2 h-6 w-6 absolute -translate-x-6 translate-y-0.5'></div>
//                   &ensp;{option}
//                 </li>
//               </>
//             ) : (
//               <li
//                 className='cursor-pointer group'
//                 key={index}
//                 onClick={() => {
//                   setAnswer(index);
//                 }}
//               >
//                 <div className='rounded-full border-gray-400 group-hover:border-1 h-6 w-6 absolute -translate-x-6 translate-y-0.5'></div>
//                 &ensp;{option}
//               </li>
//             )
//           )}
//         </ol>
//       </div>
//       <br />
//       <div className='flex justify-between'>
//         <button
//           onClick={() => {
//             goBackQuestion();
//           }}
//           className='px-4 py-2 rounded-sm font-bold bg-[#4A90E2] text-white hover:bg-[#3A80D2]'
//         >
//           Back
//         </button>

//         <button
//           onClick={() => {
//             submitAnswer(number - 1, { id: questionId, answer });
//           }}
//           className='px-4 py-2 rounded-sm font-bold bg-[#4A90E2] text-white hover:bg-[#3A80D2]'
//         >
//           {final == true ? 'Submit' : 'Next'}
//         </button>
//       </div>
//     </>
//   );
// }

// export default Question;
