package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupOrderDTO extends GroupDTO {

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long afterId;
}
