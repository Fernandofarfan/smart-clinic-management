package com.smartclinic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest implements Serializable {
    private String to;
    private String subject;
    private String body;
    private boolean isHtml;
}
