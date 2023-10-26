import React, { useCallback, useEffect, useState } from 'react';

interface LogData {
  passengers: number;
  fromFloor: number;
  toFloor: number;
  dateTime?: Date;
}

function LiftComponent() {
  const floors: number[] = Array.from({ length: 10 }, (_, index) => index + 1);
  const passengersArr: number[] = Array.from(
    { length: 12 },
    (_, index) => index + 1
  );
  const [passengers, setPassengers] = useState<number[]>([]);
  const [isLiftMoving, setIsLiftMoving] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [destinationFloor, setDestinationFloor] = useState(1);
  const [showUpArrow, setShowUpArrow] = useState(true);

  const floorDiff = currentFloor - destinationFloor;
  const isLiftMovingUp = floorDiff < 0;

  console.log('lift', {
    passengerCount: passengers.length,
    isLiftMoving,
    floorDiff,
    currentFloor,
    destinationFloor,
    isLiftMovingUp,
  });

  useEffect(() => {
    if (isLiftMoving) {
      setShowUpArrow(floorDiff < 0 ? true : false);
    }
  }, [floorDiff, isLiftMoving]);

  useEffect(() => {
    if (passengers.length > 0 && floorDiff !== 0 && !isLiftMoving) {
      setIsLiftMoving(true);
    }
  }, [floorDiff, isLiftMoving, passengers]);

  useEffect(() => {
    let interval: any;
    if (isLiftMoving) {
      const nextFloor = isLiftMovingUp ? currentFloor + 1 : currentFloor - 1;
      interval = setInterval(() => {
        setCurrentFloor(nextFloor);
        if (nextFloor === destinationFloor) {
          setIsLiftMoving(false);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentFloor, destinationFloor, isLiftMoving, isLiftMovingUp]);

  const addLog = useCallback(async (logData: LogData) => {
    const result = await fetch(`${process.env.REACT_APP_API_URL}log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        passengers: logData.passengers,
        fromFloor: logData.fromFloor,
        toFloor: logData.toFloor,
      }),
    });

    return result;
  }, []);

  useEffect(() => {
    if (isLiftMoving) {
      addLog({
        passengers: passengers.length,
        fromFloor: currentFloor,
        toFloor: destinationFloor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLog, isLiftMoving]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5rem',
        gap: '2rem',
      }}
    >
      <div className="lift-box">
        {passengersArr.map((passengerId) => {
          return (
            <button
              disabled={isLiftMoving}
              key={passengerId}
              style={{
                width: '3.3rem',
                height: '3.3rem',
                borderRadius: '50%',
                backgroundColor: passengers.includes(Number(passengerId))
                  ? 'greenyellow'
                  : 'lightgray',
              }}
              onClick={() => {
                const updatedPassengers = [...passengers];

                if (updatedPassengers.includes(Number(passengerId))) {
                  const index = updatedPassengers.indexOf(Number(passengerId));
                  updatedPassengers.splice(index, 1);
                } else {
                  updatedPassengers.push(Number(passengerId));
                }

                setPassengers(updatedPassengers);
              }}
            ></button>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              paddingInline: '1rem',
              paddingBlock: '0.5rem',
              fontSize: '2.5rem',
              backgroundColor: 'gray',
              color: 'red',
              borderRadius: '5px',
            }}
          >
            {currentFloor}
          </div>
          <div
            style={{
              fontSize: '3rem',
              color: 'red',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {showUpArrow ? '↑' : '↓'}
          </div>
        </div>
        <div className="button-box">
          {floors.reverse().map((arr) => {
            return (
              <button
                key={arr}
                disabled={isLiftMoving}
                style={{
                  paddingInline: '1.5rem',
                  paddingBlock: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  fontSize: '1rem',
                  transition: '0.2sec',
                  border: `2px solid ${
                    Number(arr) === currentFloor
                      ? 'red'
                      : Number(arr) === destinationFloor
                      ? 'green'
                      : 'transparent'
                  }`,
                }}
                onClick={() => setDestinationFloor(Number(arr))}
              >
                {arr}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LiftComponent;
