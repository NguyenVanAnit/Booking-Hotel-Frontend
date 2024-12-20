import React, { useEffect, useState } from 'react';
import { getRoomTypes } from '../utils/ApiFunctions';

const RoomTypeSelector = (handleRoomInputChange, newRoom) => {
    const [roomTypes, setRoomTypes] = useState([""]);
    const [showNewRoomType, setShowNewRoomType] = useState(false);
    const [newRoomType, setNewRoomType] = useState("");

    useEffect(() => {
        getRoomTypes().then((roomTypes) => {
            setRoomTypes(roomTypes);
        });
    }, []);

    const handleNewRoomTypeChange = (e) => {
        setNewRoomType(e.target.value);
    };

    const handleAddNewRoomType = () => {
        if (newRoomType != "") {
            setRoomTypes([...roomTypes, newRoomType]);
            setNewRoomType("");
            setShowNewRoomType(false);
        }
    };


    return (
        <>
            {roomTypes.length > 0 && (
                <div>
                    <select name="roomType" id="roomType" onChange={(e) => {
                        if (e.target.value == "Add new type") setShowNewRoomType(true)
                        else handleRoomInputChange(e)
                    }} value={newRoom.roomType}>
                        <option value="">Select Room Type</option>
                        <option value="Add new type">Add new type</option>
                        {roomTypes.map((roomType, index) => (
                            <option key={index} value={roomType}>{roomType}</option>
                        ))}
                    </select>
                    {showNewRoomType && (
                        <div>
                            <input type="text" value={newRoomType} onChange={handleNewRoomTypeChange} placeholder='Enter new room type' />
                            <button onClick={handleAddNewRoomType}>Add</button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default RoomTypeSelector;