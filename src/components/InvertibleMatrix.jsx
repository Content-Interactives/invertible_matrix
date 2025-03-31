import React, { useState } from 'react';

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
    }
  };
  
  // Get background color for input based on status
  const getInputBackground = (index) => {
    if (inputStatus[index] === null) return 'white';
    return inputStatus[index] === 'correct' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <div className="w-full shadow-md bg-white rounded-lg">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Verifying Matrix Inverses</h1>
          <p className="text-sky-800">Test your understanding of matrix inverses and their properties!</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What are Matrix Inverses?</h2>
            <p className="text-blue-600">
              Two matrices A and B are multiplicative inverses of each other if and only if:
            </p>
            <p className="text-blue-600 font-bold text-center my-2">
              A × B = B × A = I
            </p>
            <p className="text-blue-600 mb-4">
              Where I is the identity matrix (1's on the main diagonal, 0's elsewhere).
            </p>
            
            <div className="flex justify-center items-center gap-6 flex-wrap my-4">
              <div className="text-center">
                <p className="mb-2 font-medium">3×3 Identity Matrix:</p>
                <MatrixBrackets width="90px" height="90px">
                  <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                  </div>
                </MatrixBrackets>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Example</h2>
            
            <div className="bg-white p-4 rounded border border-gray-300">
              <p className="mb-4">Let's check if the following two 3×3 matrices are inverses of each other:</p>
              
              <div className="flex justify-center items-center gap-12 my-6 flex-wrap">
                <div className="text-center">
                  <p className="mb-2 font-medium">Matrix A:</p>
                  <MatrixBrackets width="90px" height="90px">
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                    </div>
                  </MatrixBrackets>
                </div>
                
                <div className="text-center">
                  <p className="mb-2 font-medium">Matrix B:</p>
                  <MatrixBrackets width="90px" height="90px">
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">-1</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                    </div>
                  </MatrixBrackets>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mt-6 mb-3">Step 1: Calculate A × B</h3>
              
              <div className="mb-6 overflow-x-auto">
                <p className="font-mono text-sm mb-2">
                  A × B = [1 1 0] × [1 -1 0]
                </p>
                <p className="font-mono text-sm mb-2">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0 1 0]&nbsp;&nbsp;[0 1 0]
                </p>
                <p className="font-mono text-sm mb-4">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0 0 1]&nbsp;&nbsp;[0 0 1]
                </p>
                
                <p className="font-mono text-sm mb-2">
                  Row 1: (1×1)+(1×0)+(0×0) = 1&nbsp;&nbsp;(1×-1)+(1×1)+(0×0) = 0&nbsp;&nbsp;(1×0)+(1×0)+(0×1) = 0
                </p>
                <p className="font-mono text-sm mb-2">
                  Row 2: (0×1)+(1×0)+(0×0) = 0&nbsp;&nbsp;(0×-1)+(1×1)+(0×0) = 1&nbsp;&nbsp;(0×0)+(1×0)+(0×1) = 0
                </p>
                <p className="font-mono text-sm mb-2">
                  Row 3: (0×1)+(0×0)+(1×0) = 0&nbsp;&nbsp;(0×-1)+(0×1)+(1×0) = 0&nbsp;&nbsp;(0×0)+(0×0)+(1×1) = 1
                </p>
                
                <div className="mt-4 flex justify-center">
                  <div className="text-center">
                    <p className="mb-2 font-medium">A × B =</p>
                    <MatrixBrackets width="90px" height="90px">
                      <div className="flex items-center">
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">0</div>
                        <div className="w-7 h-7 flex items-center justify-center align-middle text-base font-medium">1</div>
                      </div>
                    </MatrixBrackets>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <h4 className="text-green-700 font-bold mb-2">Result</h4>
                <p className="text-green-600 font-bold">
                  A × B equals the 3×3 identity matrix. Therefore, matrices A and B are inverses of each other!
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice</h2>
              <div className="flex gap-2">
                {matrixPairs.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      completedProblems[index] ? 'w-3 h-3 bg-green-500' : 
                      index === currentProblemIndex ? 'w-2 h-2 bg-purple-600 mt-0.5' : 
                      'w-3 h-3 bg-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mb-4">Check if the following two 3×3 matrices are inverses of each other:</p>
            
            <div className="bg-white p-4 rounded border border-gray-300">
              <div className="flex justify-center items-center gap-12 my-6 flex-wrap">
                <div className="text-center">
                  <p className="mb-2 font-medium">Matrix A:</p>
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
                
                <div className="text-center">
                  <p className="mb-2 font-medium">Matrix B:</p>
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
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold mb-3">Step 1: Calculate A × B</h3>
                
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium text-gray-700 mb-2">Fill in the result of A × B in the table below:</p>
                  
                  <div className="flex justify-center my-4">
                    <div className="text-center relative">
                      <MatrixBrackets width="140px" height="140px">
                        <div className="flex items-center">
                          <div className="w-8 h-8 m-1">
                            <input 
                              type="text" 
                              className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(0)}`}
                              maxLength="1"
                              value={matrixInputs[0]}
                              onChange={(e) => handleInputChange(0, e.target.value)}
                              disabled={inputsDisabled}
                            />
                          </div>
                          <div className="w-8 h-8 m-1">
                            <input 
                              type="text" 
                              className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(1)}`}
                              maxLength="1"
                              value={matrixInputs[1]}
                              onChange={(e) => handleInputChange(1, e.target.value)}
                              disabled={inputsDisabled}
                            />
                          </div>
                          <div className="w-8 h-8 m-1">
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
                          <div className="w-8 h-8 m-1">
                            <input 
                              type="text" 
                              className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(3)}`}
                              maxLength="1"
                              value={matrixInputs[3]}
                              onChange={(e) => handleInputChange(3, e.target.value)}
                              disabled={inputsDisabled}
                            />
                          </div>
                          <div className="w-8 h-8 m-1">
                            <input 
                              type="text" 
                              className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(4)}`}
                              maxLength="1"
                              value={matrixInputs[4]}
                              onChange={(e) => handleInputChange(4, e.target.value)}
                              disabled={inputsDisabled}
                            />
                          </div>
                          <div className="w-8 h-8 m-1">
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
                          <div className="w-8 h-8 m-1">
                            <input 
                              type="text" 
                              className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(6)}`}
                              maxLength="1"
                              value={matrixInputs[6]}
                              onChange={(e) => handleInputChange(6, e.target.value)}
                              disabled={inputsDisabled}
                            />
                          </div>
                          <div className="w-8 h-8 m-1">
                            <input 
                              type="text" 
                              className={`w-full h-full text-center border border-gray-300 rounded ${getInputBackground(7)}`}
                              maxLength="1"
                              value={matrixInputs[7]}
                              onChange={(e) => handleInputChange(7, e.target.value)}
                              disabled={inputsDisabled}
                            />
                          </div>
                          <div className="w-8 h-8 m-1">
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
                
                <div className={`mt-6 flex justify-center gap-4 ${showSolution ? 'hidden' : ''}`}>
                  <button 
                    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
                    onClick={checkAnswers}
                  >
                    Check
                  </button>
                  <button 
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                      onClick={() => {
                      const correctAnswers = getCorrectAnswers();
                      setMatrixInputs([...correctAnswers]);
                      setInputStatus(Array(9).fill('correct'));
                      setShowSolution(true);
                      setInputsDisabled(true);
                    }}
                  >
                    Skip
                  </button>
                </div>
              </div>
              
              <div className={`mt-6 pt-6 border-t border-gray-200 ${showSolution ? '' : 'hidden'}`}>                
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <h4 className="text-green-700 font-bold mb-2">Great Job!</h4>
                  {matrixPairs[currentProblemIndex].isInverse ? (
                    <p className="text-green-600 mb-4">
                      You've correctly identified that A × B equals the identity matrix, confirming these matrices are inverses!
                    </p>
                  ) : (
                    <p className="text-green-600 mb-4">
                      Great work! You've correctly found the product of A × B. Notice that it's not the identity matrix, meaning these matrices are not inverses of each other!
                    </p>
                  )}
                  {currentProblemIndex === matrixPairs.length - 1 ? (
                    <button
                      onClick={resetProblems}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6"></path>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                      Start Over
                    </button>
                  ) : (
                    <button
                      onClick={nextProblem}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                    >
                      Next Problem
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-purple-700">
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-gray-600 mt-4">
        Understanding matrix inverses is crucial for linear algebra and many applications!
      </p>
    </div>
  );
};

export default InvertibleMatrix;