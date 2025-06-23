import React, { useState } from 'react';
import { Button } from './ui/index.jsx';

const InvertibleMatrix = () => {
  // Matrix bracket component to ensure consistent rendering
  const MatrixBrackets = ({ children, width, height }) => (
    <div className="inline-flex flex-col justify-center items-center p-1 relative" style={{ width, height }}>
      <div className="absolute left-0 top-0 bottom-0 w-2 border-t-2 border-b-2 border-l-2 border-gray-700 z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-2 border-t-2 border-b-2 border-r-2 border-gray-700 z-10"></div>
      {children}
    </div>
  );

  // Predefined matrix pairs (each pair contains a matrix and its inverse)
  const matrixPairs = [
    // Pair 1
    {
      a: ['3', '1', '2', '0', '2', '-1', '1', '-1', '1'],
      b: ['1/3', '0', '-1/3', '-1/6', '1/2', '2/3', '1/6', '1/2', '1/3'],
      isInverse: true,
      product: ['1', '0', '0', '0', '1', '0', '0', '0', '1']
    },
    // Pair 2 - NOT an inverse pair
    {
      a: ['1', '2', '0', '0', '1', '1', '1', '0', '1'],
      b: ['2', '-2', '2', '0', '1', '-1', '-1', '2', '0'],
      isInverse: false,
      product: ['2', '0', '0', '-1', '3', '-1', '1', '0', '2']
    },
    // Pair 3
    {
      a: ['2', '0', '0', '1', '1', '0', '3', '2', '1'],
      b: ['1/2', '0', '0', '-1/2', '1', '0', '-1', '-2', '1'],
      isInverse: true,
      product: ['1', '0', '0', '0', '1', '0', '0', '0', '1']
    },
    // Pair 4 - NOT an inverse pair
    {
      a: ['1', '1', '1', '0', '1', '1', '0', '0', '1'],
      b: ['2', '-1', '0', '0', '1', '-1', '0', '0', '1'],
      isInverse: false,
      product: ['2', '0', '0', '0', '1', '0', '0', '0', '1']
    },
    // Pair 5
    {
      a: ['2', '1', '-1', '-1', '1', '0', '1', '1', '1'],
      b: ['1/3', '-1/3', '-1/3', '1/3', '2/3', '-1/3', '0', '0', '1'],
      isInverse: true,
      product: ['1', '0', '0', '0', '1', '0', '0', '0', '1']
    }
  ];

  // State for managing practice inputs and validation
  const [matrixInputs, setMatrixInputs] = useState(Array(9).fill(''));
  const [showSolution, setShowSolution] = useState(false);
  const [inputStatus, setInputStatus] = useState(Array(9).fill(null)); // null, 'correct', or 'incorrect'
  const [inputsDisabled, setInputsDisabled] = useState(false);
  
  // State for current matrices
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [completedProblems, setCompletedProblems] = useState(Array(matrixPairs.length).fill(false));
  const currentMatrixA = matrixPairs[currentProblemIndex].a;
  const currentMatrixB = matrixPairs[currentProblemIndex].b;
  
  // Expected answers for the matrix multiplication result
  const getCorrectAnswers = () => {
    const currentPair = matrixPairs[currentProblemIndex];
    return currentPair.product;
  };
  
  // Generate a new problem
  const nextProblem = () => {
    // Mark current problem as completed
    const newCompletedProblems = [...completedProblems];
    newCompletedProblems[currentProblemIndex] = true;
    setCompletedProblems(newCompletedProblems);
    
    // Move to next problem
    const nextIndex = (currentProblemIndex + 1) % matrixPairs.length;
    setCurrentProblemIndex(nextIndex);
    
    // Reset state for new problem
    setMatrixInputs(Array(9).fill(''));
    setShowSolution(false);
    setInputStatus(Array(9).fill(null));
    setInputsDisabled(false);
  };
  
  // Reset all problems
  const resetProblems = () => {
    setCurrentProblemIndex(0);
    setCompletedProblems(Array(matrixPairs.length).fill(false));
    setMatrixInputs(Array(9).fill(''));
    setShowSolution(false);
    setInputStatus(Array(9).fill(null));
    setInputsDisabled(false);
  };
  
  // Handle input change
  const handleInputChange = (index, value) => {
    const newInputs = [...matrixInputs];
    newInputs[index] = value;
    setMatrixInputs(newInputs);
  };
  
  // Check answers
  const checkAnswers = () => {
    const newStatus = matrixInputs.map((input, index) => {
      // Compare with correct answer for this problem
      const correctAnswers = getCorrectAnswers();
      return input === correctAnswers[index] ? 'correct' : 'incorrect';
    });
    
    setInputStatus(newStatus);
    
    // Only show solution if all answers are correct
    const allCorrect = newStatus.every(status => status === 'correct');
    setShowSolution(allCorrect);
    
    // Disable inputs if all answers are correct
    if (allCorrect) {
      setInputsDisabled(true);
      // Mark current problem as completed
      const newCompletedProblems = [...completedProblems];
      newCompletedProblems[currentProblemIndex] = true;
      setCompletedProblems(newCompletedProblems);
    }
  };
  
  // Get background color for input based on status
  const getInputBackground = (index) => {
    if (inputStatus[index] === null) return 'white';
    return inputStatus[index] === 'correct' ? 'bg-green-100' : 'bg-yellow-100';
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: rgb(250, 245, 255);
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Matrix Inverse Practice</h2>
            <button
              onClick={resetProblems}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Problem {currentProblemIndex + 1}</h2>
              <div className="flex gap-2">
                {matrixPairs.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      completedProblems[index] ? 'w-3 h-3 bg-[#008545]' : 
                      index === currentProblemIndex ? 'w-2 h-2 bg-[#5750E3] mt-0.5' : 
                      'w-3 h-3 bg-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="font-medium text-sm mb-2">Fill in the result of multiplying these matrices below:</p>
              
              <div className="flex justify-center items-center gap-4 my-6">
                <div className="text-center">
                  <p className="mb-2 font-medium text-sm">Matrix A</p>
                  <MatrixBrackets width="90px" height="90px">
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[0]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[1]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[2]}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[3]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[4]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[5]}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[6]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[7]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixA[8]}</div>
                    </div>
                  </MatrixBrackets>
                </div>

                <div className="flex items-center text-2xl font-bold text-gray-600 pt-7">
                  ×
                </div>
                
                <div className="text-center">
                  <p className="mb-2 font-medium text-sm">Matrix B</p>
                  <MatrixBrackets width="90px" height="90px">
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[0]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[1]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[2]}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[3]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[4]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[5]}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[6]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[7]}</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">{currentMatrixB[8]}</div>
                    </div>
                  </MatrixBrackets>
                </div>

                <div className="flex items-center text-2xl font-bold text-gray-600 pt-7">
                  =
                </div>

                <div className="text-center">
                  <p className="mb-2 font-medium text-sm">Result</p>
                  <MatrixBrackets width="90px" height="90px">
                    <div className="flex items-center">
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(0)}`}
                          maxLength="1"
                          value={matrixInputs[0]}
                          onChange={(e) => handleInputChange(0, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(1)}`}
                          maxLength="1"
                          value={matrixInputs[1]}
                          onChange={(e) => handleInputChange(1, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(2)}`}
                          maxLength="1"
                          value={matrixInputs[2]}
                          onChange={(e) => handleInputChange(2, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(3)}`}
                          maxLength="1"
                          value={matrixInputs[3]}
                          onChange={(e) => handleInputChange(3, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(4)}`}
                          maxLength="1"
                          value={matrixInputs[4]}
                          onChange={(e) => handleInputChange(4, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(5)}`}
                          maxLength="1"
                          value={matrixInputs[5]}
                          onChange={(e) => handleInputChange(5, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(6)}`}
                          maxLength="1"
                          value={matrixInputs[6]}
                          onChange={(e) => handleInputChange(6, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(7)}`}
                          maxLength="1"
                          value={matrixInputs[7]}
                          onChange={(e) => handleInputChange(7, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                      <div className="w-7 h-7 m-0.5">
                        <input 
                          type="text" 
                          className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(8)}`}
                          maxLength="1"
                          value={matrixInputs[8]}
                          onChange={(e) => handleInputChange(8, e.target.value)}
                          disabled={inputsDisabled}
                        />
                      </div>
                    </div>
                  </MatrixBrackets>
                </div>
              </div>
            </div>

            {showSolution && (
              <div className="bg-[#008545]/10 border border-[#008545] p-4 rounded-lg mb-4">
                <p className="text-[#008545] font-medium text-sm mb-2">
                  Correct!
                </p>
                <p className="text-gray-900 text-sm">
                  {matrixPairs[currentProblemIndex].isInverse 
                    ? "And since the result is the identity matrix, these matrices are inverses!"
                    : "And since the result is not the identity matrix, these matrices are not inverses!"}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {!showSolution && (
                <div className="glow-button simple-glow">
                  <Button
                    onClick={checkAnswers}
                    className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded"
                  >
                    Check
                  </Button>
                </div>
              )}
              {showSolution && (
                <div className="glow-button simple-glow">
                  <Button
                    onClick={resetProblems}
                    className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded"
                  >
                    {currentProblemIndex === matrixPairs.length - 1 ? "Start Over" : "Next Problem"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvertibleMatrix;